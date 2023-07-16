<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="销售方" prop="seller">
        <el-input
          v-model="queryParams.seller"
          placeholder="请输入销售方"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="购买方" prop="buyer">
        <el-input
          v-model="queryParams.buyer"
          placeholder="请输入购买方"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开票时间" prop="billingTime">
        <el-date-picker clearable
          v-model="queryParams.billingTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开票时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="收货日期" prop="takeTime">
        <el-date-picker clearable
          v-model="queryParams.takeTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择收货日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:finance:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:finance:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:finance:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:finance:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="financeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="发货单财务表id" align="center" prop="id" />
      <el-table-column label="销售方" align="center" prop="seller" />
      <el-table-column label="购买方" align="center" prop="buyer" />
      <el-table-column label="开票金额" align="center" prop="billingAmount" />
      <el-table-column label="开票时间" align="center" prop="billingTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.billingTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货日期" align="center" prop="takeTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.takeTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收获金额" align="center" prop="takeAmuont" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:finance:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:finance:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改财务单管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="销售方" prop="seller">
          <el-input v-model="form.seller" placeholder="请输入销售方" />
        </el-form-item>
        <el-form-item label="购买方" prop="buyer">
          <el-input v-model="form.buyer" placeholder="请输入购买方" />
        </el-form-item>
        <el-form-item label="开票金额" prop="billingAmount">
          <el-input v-model="form.billingAmount" placeholder="请输入开票金额" />
        </el-form-item>
        <el-form-item label="开票时间" prop="billingTime">
          <el-date-picker clearable
            v-model="form.billingTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开票时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收货日期" prop="takeTime">
          <el-date-picker clearable
            v-model="form.takeTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择收货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收获金额" prop="takeAmuont">
          <el-input v-model="form.takeAmuont" placeholder="请输入收获金额" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listFinance, getFinance, delFinance, addFinance, updateFinance } from "@/api/system/finance";

export default {
  name: "Finance",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 财务单管理表格数据
      financeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        seller: null,
        buyer: null,
        billingTime: null,
        takeTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        seller: [
          { required: true, message: "销售方不能为空", trigger: "blur" }
        ],
        buyer: [
          { required: true, message: "购买方不能为空", trigger: "blur" }
        ],
        billingAmount: [
          { required: true, message: "开票金额不能为空", trigger: "blur" }
        ],
        billingTime: [
          { required: true, message: "开票时间不能为空", trigger: "blur" }
        ],
        takeTime: [
          { required: true, message: "收货日期不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询财务单管理列表 */
    getList() {
      this.loading = true;
      listFinance(this.queryParams).then(response => {
        this.financeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        seller: null,
        buyer: null,
        billingAmount: null,
        billingTime: null,
        takeTime: null,
        takeAmuont: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加财务单管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFinance(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改财务单管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFinance(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFinance(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除财务单管理编号为"' + ids + '"的数据项？').then(function() {
        return delFinance(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/finance/export', {
        ...this.queryParams
      }, `finance_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
